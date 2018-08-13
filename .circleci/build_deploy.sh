#!/usr/bin/env bash
ROOT_DIR=$(pwd)

source $ROOT_DIR/.circleci/utils.sh

checkoutDeployScriptRepo(){
    require DEPLOY_SCRIPTS_REPO $DEPLOY_SCRIPTS_REPO
    info "Cloning $DEPLOY_SCRIPTS_REPO"
    git clone -b $CLONE_BRANCH $DEPLOY_SCRIPTS_REPO $HOME/travella-deploy
    mv $HOME/travella-deploy/deploy $ROOT_DIR/deploy
    source $ROOT_DIR/deploy/template.sh
    rm -rf $HOME/travella-deploy
}

# checkout
buildTagAndPushDockerImage() {
    require 'DOCKER_REGISTRY' $DOCKER_REGISTRY
    require 'PROJECT_ID' $PROJECT_ID
    require 'IMAGE_TAG' $IMAGE_TAG
    require 'SERVICE_KEY_PATH' $SERVICE_KEY_PATH

    # gcr.io/andela-learning/travella-backend
    IMAGE_NAME="$DOCKER_REGISTRY/$PROJECT_ID/$PROJECT_NAME"
    TAGGED_IMAGE=$IMAGE_NAME:$IMAGE_TAG
    DOCKER_USERNAME=${DOCKER_USERNAME:-_json_key}

    info "Build docker image for travella application"
    docker build -t $IMAGE_NAME -f docker/release/Dockerfile .

    info "Tagging built docker image as $TAGGED_IMAGE"
    docker tag $IMAGE_NAME $TAGGED_IMAGE
    is_success "Image successfully tagged $TAGGED_IMAGE"

    info "Login to $DOCKER_REGISTRY container registry"
    is_success_or_fail $(docker login -u  $DOCKER_USERNAME --password-stdin https://${DOCKER_REGISTRY} < $SERVICE_KEY_PATH)

    info "Push $TAGGED_IMAGE to $DOCKER_REGISTRY container registry"
    docker push $TAGGED_IMAGE

    info "Logout of docker container registry"
    is_success_or_fail $(docker logout https://${DOCKER_REGISTRY})

}

buildLintAndDeployK8sConfiguration(){
    findTempateFiles 'TEMPLATES'
    findAndReplaceVariables

    info "Linting generated configuration files"
    k8s-lint -f deploy/travella-backend
    is_success "Completed linting successfully"

    info "Initiating deployment for image $TAGGED_IMAGE to $ENVIRONMENT environment"
    k8s-deploy-and-verify -f deploy/travella-backend
    is_success "$TAGGED_IMAGE successfully deployed"
}

slackPayLoad() {
    require NOTIFICATION_CHANNEL $NOTIFICATION_CHANNEL
    require SLACK_DEPLOYMENT_TEXT $SLACK_DEPLOYMENT_TEXT
cat <<EOF
{
    "channel":"${NOTIFICATION_CHANNEL}",
    "username": "DeployNotification",
    "text": "${SLACK_TEXT}",
    "icon_emoji": ":rocket:"
}
EOF
}

sendSlackDeployNotification() {
    require SLACK_CHANNEL_HOOK $SLACK_CHANNEL_HOOK
    info "Sending success message to slack"
    curl -X POST --data-urlencode "payload=$(slackPayLoad)" "${SLACK_CHANNEL_HOOK}"
    is_success "Slack notification has been successfully sent"
}

main() {
    checkoutDeployScriptRepo
    buildTagAndPushDockerImage
    buildLintAndDeployK8sConfiguration
    sendSlackDeployNotification
    cleanGeneratedYamlFiles
}

$@