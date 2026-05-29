// "だれが あそぶ？" name-edit modal.

import React, { useEffect, useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { fonts } from '../theme/theme';

export function NameModal({
  visible,
  initialName,
  onCancel,
  onSave,
}: {
  visible: boolean;
  initialName: string;
  onCancel: () => void;
  onSave: (name: string) => void;
}) {
  const [value, setValue] = useState('');
  useEffect(() => {
    if (visible) setValue('');
  }, [visible]);

  const save = () => {
    if (value.trim()) onSave(value.trim());
    else onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <View style={{ backgroundColor: 'white', padding: 30, borderRadius: 24, width: '100%', maxWidth: 320 }}>
          <Text style={{ color: '#E91E63', fontSize: 22, fontFamily: fonts.black, textAlign: 'center', marginBottom: 16 }}>
            だれが あそぶ？
          </Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder={initialName}
            maxLength={10}
            autoFocus
            style={{
              borderWidth: 3,
              borderColor: '#ddd',
              borderRadius: 12,
              padding: 14,
              fontSize: 20,
              fontFamily: fonts.bold,
              textAlign: 'center',
              marginBottom: 20,
            }}
          />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => ({
                flex: 1,
                padding: 14,
                backgroundColor: '#f5f5f5',
                borderRadius: 12,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: '#666', textAlign: 'center' }}>やめる</Text>
            </Pressable>
            <Pressable
              onPress={save}
              style={({ pressed }) => ({
                flex: 1,
                padding: 14,
                backgroundColor: '#E91E63',
                borderRadius: 12,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ fontSize: 16, fontFamily: fonts.black, color: 'white', textAlign: 'center' }}>けってい</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
