import {gql} from "@apollo/client";

const SYNC_MY_MESSAGES = gql`
query myMessages($user: String!) {

  Sent:messages(where: 
        {from: $user},
  ) {
    id
    from
    to
    text
    pubkeyX
    pubkeyYodd
    iv
    eventSavedOrNft
  }
  Received: messages(where: 
        {to: $user},
  ) {
    id
    from
    to
    text
    pubkeyX
    pubkeyYodd
    iv
    eventSavedOrNft
  }
}
`

const LISTEN_TO_NEW_MESSAGES = gql`
query myNewMessages($user: String!) @live(interval: 3000){

  Sent:messages(last: 10, where: 
        {from: $user}, 
  ) {
    id
    from
    to
    text
    pubkeyX
    pubkeyYodd
    iv
    eventSavedOrNft
  }
  Received: messages(last: 10, where: 
        {to: $user}, 
  ) {
    id
    from
    to
    text
    pubkeyX
    pubkeyYodd
    iv
    eventSavedOrNft
  }
}
`

 export {SYNC_MY_MESSAGES, LISTEN_TO_NEW_MESSAGES}