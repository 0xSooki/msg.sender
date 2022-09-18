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
query myNewMessages($user: String!){

  Sent:messages(where: 
        {from: $user}, last: 5
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
        {to: $user}, last: 5
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