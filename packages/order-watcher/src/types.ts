import { OrderState, SignedOrder } from '@0x/types';
import { LogEntryEvent } from 'ethereum-types';

export enum OrderWatcherError {
    SubscriptionAlreadyPresent = 'SUBSCRIPTION_ALREADY_PRESENT',
    SubscriptionNotFound = 'SUBSCRIPTION_NOT_FOUND',
}

export type EventWatcherCallback = (err: null | Error, log?: LogEntryEvent) => void;

/**
 * orderExpirationCheckingIntervalMs: How often to check for expired orders. Default=50.
 * eventPollingIntervalMs: How often to poll the Ethereum node for new events. Default=200.
 * expirationMarginMs: Amount of time before order expiry that you'd like to be notified
 * of an orders expiration. Default=0.
 * cleanupJobIntervalMs: How often to run a cleanup job which revalidates all the orders. Default=1hr.
 * isVerbose: Weather the order watcher should be verbose. Default=true.
 */
export interface OrderWatcherConfig {
    orderExpirationCheckingIntervalMs: number;
    eventPollingIntervalMs: number;
    expirationMarginMs: number;
    cleanupJobIntervalMs: number;
    isVerbose: boolean;
}

export type OnOrderStateChangeCallback = (err: Error | null, orderState?: OrderState) => void;

export enum InternalOrderWatcherError {
    NoAbiDecoder = 'NO_ABI_DECODER',
    ZrxNotInTokenRegistry = 'ZRX_NOT_IN_TOKEN_REGISTRY',
    WethNotInTokenRegistry = 'WETH_NOT_IN_TOKEN_REGISTRY',
}

export enum OrderWatcherAction {
    // Actions initiated by the user.
    GetStats = 'GET_STATS',
    AddOrder = 'ADD_ORDER',
    RemoveOrder = 'REMOVE_ORDER',
    // These are spontaneous; they are primarily orderstate changes.
    Update = 'UPDATE',
    // `subscribe` and `unsubscribe` are methods of OrderWatcher, but we don't
    // need to expose them to the WebSocket server user because the user implicitly
    // subscribes and unsubscribes by connecting and disconnecting from the server.
}

// Users have to create a json object of this format and attach it to
// the data field of their WebSocket message to interact with the server.
export interface WebSocketRequest {
    action: OrderWatcherAction;
    signedOrder?: SignedOrder;
    orderHash?: string;
}

// Users should expect a json object of this format in the data field
// of the WebSocket messages that the server sends out.
export interface WebSocketResponse {
    action: OrderWatcherAction | null;
    success: boolean;
    result: any;
}
