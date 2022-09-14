import {gql} from "@apollo/client";

export const SYNC_MY_MESSAGES = gql`
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

export const LISTEN_TO_NEW_MESSAGES = gql`
query myMessages($user: String!) @live{

  Sent:messages(where: 
        {from: $user}, last: 1
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
        {to: $user}, last: 1
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
