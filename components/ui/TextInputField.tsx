import React, { useState } from 'react'
import { View, TextInput, StyleSheet, type TextInputProps, type ViewStyle } from 'react-native'
import { Text } from './Text'
import { BG_INPUT, BORDER_DEFAULT, ACCENT, ACCENT_BORDER, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, ERROR } from '@/lib/theme'
import { Fonts } from '@/lib/typography'

interface TextInputFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string
  error?: string
  hint?: string
  charCount?: { current: number; max: number }
  multiline?: boolean
  style?: ViewStyle
  inputStyle?: TextInputProps['style']
}

/**
 * Velvet text input with floating label, error, hint, and char count.
 */
export function TextInputField({
  label, error, hint, charCount, multiline = false, style, inputStyle, ...rest
}: TextInputFieldProps) {
  const [focused, setFocused] = useState(false)

  const borderColor = error ? ERROR : focused ? ACCENT_BORDER : BORDER_DEFAULT

  return (
    <View style={[s.wrapper, style]}>
      {label && (
        <Text variant="label" uppercase color="secondary" style={s.label}>
          {label}
        </Text>
      )}

      <TextInput
        {...rest}
        multiline={multiline}
        onFocus={(e) => { setFocused(true); rest.onFocus?.(e) }}
        onBlur={(e) => { setFocused(false); rest.onBlur?.(e) }}
        placeholderTextColor={TEXT_TERTIARY}
        style={[
          s.input,
          { borderColor },
          multiline && { minHeight: 100, textAlignVertical: 'top', paddingTop: 14 },
          inputStyle,
        ]}
      />

      <View style={s.bottomRow}>
        {error ? (
          <Text variant="caption" color="error">{error}</Text>
        ) : hint ? (
          <Text variant="caption" color="tertiary">{hint}</Text>
        ) : (
          <View />
        )}

        {charCount && (
          <Text
            variant="caption"
            color={charCount.current > charCount.max ? 'error' : 'tertiary'}
          >
            {charCount.current}/{charCount.max}
          </Text>
        )}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    marginLeft: 2,
  },
  input: {
    backgroundColor: BG_INPUT,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: TEXT_PRIMARY,
    fontFamily: Fonts.dmRegular,
    fontSize: 15,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
})
