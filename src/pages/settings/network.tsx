/*
 * Project: ZilPay-wallet
 * Author: Rinat(lich666dead)
 * -----
 * Modified By: the developer formerly known as Rinat(lich666dead) at <lich666black@gmail.com>
 * -----
 * Copyright (c) 2020 ZilPay
 */
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { useTheme } from '@react-navigation/native';

import { Selector } from 'app/components/selector';
import { NetwrokConfig } from 'app/components/netwrok-config';
import { Button } from 'app/components/button';
import { DropMenu } from 'app/components/drop-menu';

import i18n from 'app/lib/i18n';
import { keystore } from 'app/keystore';
import { ZILLIQA_KEYS } from 'app/config';
import { fonts } from 'app/styles';

const [mainnet, testnet, custom] = ZILLIQA_KEYS;
const netwroks = Object.keys(keystore.network.config);
export const NetworkPage = () => {
  const { colors } = useTheme();
  const networkState = keystore.network.store.useValue();
  const ssnState = keystore.ssn.store.useValue();

  const [isLoading, setIsLoading] = React.useState(false);

  const nodeList = React.useMemo(
    () => ssnState.list.sort((a, b) => a.time - b.time).map((el) => ({
      name: el.name,
      value: `${Math.floor(el.time)}ms`
    })),
    [ssnState]
  );

  const handleReset = React.useCallback(async() => {
    setIsLoading(true);
    try {
      await keystore.network.reset();
      await keystore.transaction.sync();
      await keystore.account.balanceUpdate();
      await keystore.ssn.reset();
      await keystore.settings.sync();
    } catch {
      //
    }
    setIsLoading(false);
  }, []);
  const handleNetwrokChange = React.useCallback(async(net) => {
    setIsLoading(true);
    try {
      await keystore.network.changeNetwork(net);

      if (net !== custom) {
        await keystore.transaction.sync();
        await keystore.ssn.sync();
        await keystore.settings.sync();
      }

      const { selectedAddress } = keystore.account.store.get();
      await keystore.account.zilBalaceUpdate();
      await keystore.account.updateNonce(selectedAddress);
    } catch (err) {
      // console.log(err);
    }
    setIsLoading(false);
  }, []);
  const hanldeChangeSSN = React.useCallback(async({ name }) => {
    setIsLoading(true);

    try {
      await keystore.ssn.changeSSn(name);
    } catch {
      //
    }
    setIsLoading(false);
  }, []);
  const hanldeSSNUpdate = React.useCallback(async() => {
    setIsLoading(true);
    try {
      await keystore.ssn.reset();
    } catch {
      //
    }
    setIsLoading(false);
  }, []);

  return (
    <SafeAreaView style={[styles.container, {
      backgroundColor: colors.background
    }]}>
      <View style={styles.titleWrapper}>
        <Text style={[styles.title, {
          color: colors.text
        }]}>
          {i18n.t('netwrok_title')}
        </Text>
        <Button
          title={i18n.t('reset')}
          color={colors.primary}
          onPress={handleReset}
        />
      </View>
      <ScrollView>
        <Selector
          style={{ marginVertical: 16 }}
          title={i18n.t('netwrok_options')}
          items={netwroks}
          selected={networkState.selected}
          onSelect={handleNetwrokChange}
        />
        {networkState.selected === custom ? (
          <NetwrokConfig
            config={networkState.config}
            selected={networkState.selected}
            onChange={(netConfig) => keystore.network.changeConfig(netConfig)}
          />
        ) : (
          <DropMenu
            selected={{
              name: ssnState.selected
            }}
            title={i18n.t('ssn')}
            list={nodeList}
            isLoading={isLoading}
            onUpdate={hanldeSSNUpdate}
            onSelect={hanldeChangeSSN}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10%',
    paddingHorizontal: 15
  },
  title: {
    fontSize: 30,
    fontFamily: fonts.Bold
  },
});

export default NetworkPage;
