import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function CustomDrawer(props: any) {
  const { mode, colors, toggleTheme } = useTheme();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </View>
      <View style={styles.themeRow}>
        <Text style={[styles.themeText, { color: colors.text }]}>Dark Mode</Text>
        <Switch
          value={mode === 'dark'}
          onValueChange={toggleTheme}
          thumbColor={colors.primary}
          trackColor={{ true: colors.primary, false: colors.secondary }}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  themeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
