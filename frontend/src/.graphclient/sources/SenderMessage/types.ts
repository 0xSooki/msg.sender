
import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace SenderMessageTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: bigint;
  Bytes: any;
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Message = {
  id: Scalars['ID'];
  from: Scalars['Bytes'];
  to: Scalars['Bytes'];
  text: Scalars['String'];
  pubkeyX: Scalars['BigInt'];
  pubkeyYodd: Scalars['Boolean'];
  iv: Scalars['BigInt'];
  eventSavedOrNft: Scalars['Int'];
  amount: Scalars['BigInt'];
};

export type Message_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  from?: InputMaybe<Scalars['Bytes']>;
  from_not?: InputMaybe<Scalars['Bytes']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']>>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  from_contains?: InputMaybe<Scalars['Bytes']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']>;
  to?: InputMaybe<Scalars['Bytes']>;
  to_not?: InputMaybe<Scalars['Bytes']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_contains?: InputMaybe<Scalars['Bytes']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']>;
  text?: InputMaybe<Scalars['String']>;
  text_not?: InputMaybe<Scalars['String']>;
  text_gt?: InputMaybe<Scalars['String']>;
  text_lt?: InputMaybe<Scalars['String']>;
  text_gte?: InputMaybe<Scalars['String']>;
  text_lte?: InputMaybe<Scalars['String']>;
  text_in?: InputMaybe<Array<Scalars['String']>>;
  text_not_in?: InputMaybe<Array<Scalars['String']>>;
  text_contains?: InputMaybe<Scalars['String']>;
  text_contains_nocase?: InputMaybe<Scalars['String']>;
  text_not_contains?: InputMaybe<Scalars['String']>;
  text_not_contains_nocase?: InputMaybe<Scalars['String']>;
  text_starts_with?: InputMaybe<Scalars['String']>;
  text_starts_with_nocase?: InputMaybe<Scalars['String']>;
  text_not_starts_with?: InputMaybe<Scalars['String']>;
  text_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  text_ends_with?: InputMaybe<Scalars['String']>;
  text_ends_with_nocase?: InputMaybe<Scalars['String']>;
  text_not_ends_with?: InputMaybe<Scalars['String']>;
  text_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pubkeyX?: InputMaybe<Scalars['BigInt']>;
  pubkeyX_not?: InputMaybe<Scalars['BigInt']>;
  pubkeyX_gt?: InputMaybe<Scalars['BigInt']>;
  pubkeyX_lt?: InputMaybe<Scalars['BigInt']>;
  pubkeyX_gte?: InputMaybe<Scalars['BigInt']>;
  pubkeyX_lte?: InputMaybe<Scalars['BigInt']>;
  pubkeyX_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pubkeyX_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pubkeyYodd?: InputMaybe<Scalars['Boolean']>;
  pubkeyYodd_not?: InputMaybe<Scalars['Boolean']>;
  pubkeyYodd_in?: InputMaybe<Array<Scalars['Boolean']>>;
  pubkeyYodd_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  iv?: InputMaybe<Scalars['BigInt']>;
  iv_not?: InputMaybe<Scalars['BigInt']>;
  iv_gt?: InputMaybe<Scalars['BigInt']>;
  iv_lt?: InputMaybe<Scalars['BigInt']>;
  iv_gte?: InputMaybe<Scalars['BigInt']>;
  iv_lte?: InputMaybe<Scalars['BigInt']>;
  iv_in?: InputMaybe<Array<Scalars['BigInt']>>;
  iv_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  eventSavedOrNft?: InputMaybe<Scalars['Int']>;
  eventSavedOrNft_not?: InputMaybe<Scalars['Int']>;
  eventSavedOrNft_gt?: InputMaybe<Scalars['Int']>;
  eventSavedOrNft_lt?: InputMaybe<Scalars['Int']>;
  eventSavedOrNft_gte?: InputMaybe<Scalars['Int']>;
  eventSavedOrNft_lte?: InputMaybe<Scalars['Int']>;
  eventSavedOrNft_in?: InputMaybe<Array<Scalars['Int']>>;
  eventSavedOrNft_not_in?: InputMaybe<Array<Scalars['Int']>>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type Message_orderBy =
  | 'id'
  | 'from'
  | 'to'
  | 'text'
  | 'pubkeyX'
  | 'pubkeyYodd'
  | 'iv'
  | 'eventSavedOrNft'
  | 'amount';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Query = {
  message?: Maybe<Message>;
  messages: Array<Message>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QuerymessageArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerymessagesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Message_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Message_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  message?: Maybe<Message>;
  messages: Array<Message>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionmessageArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionmessagesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Message_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Message_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Timestamp of the block if available, format depends on the chain */
  timestamp?: Maybe<Scalars['String']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

}
export type QuerySenderMessageSdk = {
  /** undefined **/
  message: InContextSdkMethod<SenderMessageTypes.Query['message'], SenderMessageTypes.QuerymessageArgs, MeshContext>,
  /** undefined **/
  messages: InContextSdkMethod<SenderMessageTypes.Query['messages'], SenderMessageTypes.QuerymessagesArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<SenderMessageTypes.Query['_meta'], SenderMessageTypes.Query_metaArgs, MeshContext>
};

export type MutationSenderMessageSdk = {

};

export type SubscriptionSenderMessageSdk = {
  /** undefined **/
  message: InContextSdkMethod<SenderMessageTypes.Subscription['message'], SenderMessageTypes.SubscriptionmessageArgs, MeshContext>,
  /** undefined **/
  messages: InContextSdkMethod<SenderMessageTypes.Subscription['messages'], SenderMessageTypes.SubscriptionmessagesArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<SenderMessageTypes.Subscription['_meta'], SenderMessageTypes.Subscription_metaArgs, MeshContext>
};
export type SenderMessageContext = {
      ["SenderMessage"]: { Query: QuerySenderMessageSdk, Mutation: MutationSenderMessageSdk, Subscription: SubscriptionSenderMessageSdk },
      
    };