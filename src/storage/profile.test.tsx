import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { DEFAULT_NAME, ProfileProvider, useProfile } from './profile';

const wrapper = ({ children }: { children: React.ReactNode }) => <ProfileProvider>{children}</ProfileProvider>;

const renderProfile = async () => {
  const view = renderHook(() => useProfile(), { wrapper });
  await waitFor(() => expect(view.result.current.ready).toBe(true));
  return view;
};

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('ProfileProvider', () => {
  it('starts with defaults when storage is empty', async () => {
    const { result } = await renderProfile();
    expect(result.current.name).toBe(DEFAULT_NAME);
    expect(result.current.stamps).toEqual({});
  });

  it('hydrates persisted name and stamps on launch', async () => {
    await AsyncStorage.setItem('@sakura/name', 'たろう');
    await AsyncStorage.setItem('@sakura/stamps', JSON.stringify({ 'math-1': true }));

    const { result } = await renderProfile();
    expect(result.current.name).toBe('たろう');
    expect(result.current.stamps).toEqual({ 'math-1': true });
  });

  it('addStamp records and persists, and is idempotent', async () => {
    const { result } = await renderProfile();

    await act(async () => result.current.addStamp('nazo-かんたん（★☆☆）'));
    expect(result.current.stamps['nazo-かんたん（★☆☆）']).toBe(true);

    const persisted = JSON.parse((await AsyncStorage.getItem('@sakura/stamps')) ?? '{}');
    expect(persisted['nazo-かんたん（★☆☆）']).toBe(true);

    // Adding the same stamp again should not change the object identity-wise / count.
    await act(async () => result.current.addStamp('nazo-かんたん（★☆☆）'));
    expect(Object.keys(result.current.stamps)).toHaveLength(1);
  });

  it('setName trims and persists, and ignores empty input', async () => {
    const { result } = await renderProfile();

    await act(async () => result.current.setName('  はな  '));
    expect(result.current.name).toBe('はな');
    expect(await AsyncStorage.getItem('@sakura/name')).toBe('はな');

    await act(async () => result.current.setName('   '));
    expect(result.current.name).toBe('はな'); // unchanged
  });

  it('wipeAll resets name + stamps and clears storage', async () => {
    const { result } = await renderProfile();

    await act(async () => {
      result.current.setName('たろう');
      result.current.addStamp('math-1');
    });
    expect(result.current.stamps['math-1']).toBe(true);

    await act(async () => result.current.wipeAll());

    expect(result.current.name).toBe(DEFAULT_NAME);
    expect(result.current.stamps).toEqual({});
    expect(await AsyncStorage.getItem('@sakura/name')).toBeNull();
    expect(await AsyncStorage.getItem('@sakura/stamps')).toBeNull();
  });
});
