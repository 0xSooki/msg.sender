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
