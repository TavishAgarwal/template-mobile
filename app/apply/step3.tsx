import React, { useState } from 'react'
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/Text'
import { GoldButton, GhostButton } from '@/components/ui/Button'
import { TextInputField } from '@/components/ui/TextInputField'
import { StepProgress } from '@/components/application/StepProgress'
import { useApplication } from '@/contexts/ApplicationContext'
import { BG_BASE } from '@/lib/theme'
import { MIN_ESSAY_LENGTH, MAX_ESSAY_LENGTH } from '@/lib/constants'

export default function ApplyStep3() {
  const insets = useSafeAreaInsets()
  const { data, dispatch } = useApplication()
  const [essay, setEssay] = useState(data.why_join)
  const [error, setError] = useState('')

  const validate = () => {
    if (essay.trim().length < MIN_ESSAY_LENGTH) {
      setError(`Minimum ${MIN_ESSAY_LENGTH} characters`)
      return false
    }
    if (essay.trim().length > MAX_ESSAY_LENGTH) {
      setError(`Maximum ${MAX_ESSAY_LENGTH} characters`)
      return false
    }
    setError('')
    return true
  }

  const handleNext = () => {
    if (!validate()) return
    dispatch({ type: 'SET_STEP_3', payload: { why_join: essay.trim() } })
    router.push('/apply/step4')
  }

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <StepProgress currentStep={3} totalSteps={4} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          <Text variant="h1" color="primary">Why Velvet?</Text>
          <Text variant="body" color="secondary" style={{ marginTop: 4, marginBottom: 24 }}>
            Tell us what draws you to this community and what you hope to contribute.
          </Text>

          <TextInputField
            label="YOUR ANSWER"
            placeholder="Write something genuine. We value depth over polish."
            value={essay}
            onChangeText={setEssay}
            error={error}
            multiline
            charCount={{ current: essay.length, max: MAX_ESSAY_LENGTH }}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[s.footer, { paddingBottom: insets.bottom + 16 }]}>
        <GoldButton title="Continue" onPress={handleNext} fullWidth />
        <GhostButton title="Back" onPress={() => router.back()} fullWidth />
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG_BASE },
  content: { padding: 24, paddingTop: 28 },
  footer: { paddingHorizontal: 24, gap: 10 },
})
