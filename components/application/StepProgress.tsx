import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from '@/components/ui/Text'
import { ACCENT, ACCENT_DIM, BORDER_DEFAULT, BG_SURFACE } from '@/lib/theme'

interface StepProgressProps {
  currentStep: number
  totalSteps: number
}

/**
 * Animated gold step progress bar for the application flow.
 */
export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  return (
    <View style={s.container}>
      <View style={s.row}>
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1
          const isActive = step <= currentStep
          const isCurrent = step === currentStep

          return (
            <View key={step} style={s.stepItem}>
              <View
                style={[
                  s.dot,
                  isActive && s.dotActive,
                  isCurrent && s.dotCurrent,
                ]}
              >
                <Text
                  variant="caption"
                  color={isActive ? 'inverse' : 'tertiary'}
                  style={{ fontWeight: '700', fontSize: 10 }}
                >
                  {step}
                </Text>
              </View>
              {step < totalSteps && (
                <View style={[s.line, isActive && s.lineActive]} />
              )}
            </View>
          )
        })}
      </View>
      <Text variant="caption" color="secondary" align="center" style={{ marginTop: 6 }}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 32,
    backgroundColor: BG_SURFACE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_DEFAULT,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: BORDER_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  dotCurrent: {
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: BORDER_DEFAULT,
    marginHorizontal: 6,
  },
  lineActive: {
    backgroundColor: ACCENT,
  },
})
