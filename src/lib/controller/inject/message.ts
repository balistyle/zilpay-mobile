/*
 * Project: ZilPay-wallet
 * Author: Rinat(lich666dead)
 * -----
 * Modified By: the developer formerly known as Rinat(lich666dead) at <lich666black@gmail.com>
 * -----
 * Copyright (c) 2020 ZilPay
 */
import { MessageType, MessagePayload } from 'types';
import { Messages } from 'app/config';

export class Message {
  private _message: MessageType;

  constructor(type: Messages, payload: MessagePayload) {
    this._message = {
      type,
      payload
    };
  }

  public get serialize() {
    return JSON.stringify(this._message);
  }
}
