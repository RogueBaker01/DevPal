import React from 'react';
import { View, Text, TextInput, StyleSheet, Platform, ScrollView, Pressable } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '@/constants/designTokens';

interface CodeEditorProps {
    code: string;
    onCodeChange: (code: string) => void;
    language?: string;
    placeholder?: string;
    onLanguageChange?: (lang: string) => void;
    availableLanguages?: string[];
}

export function CodeEditor({
    code,
    onCodeChange,
    language = 'python',
    placeholder = '// Tu código aquí...',
    onLanguageChange,
    availableLanguages = ['python', 'javascript'],
}: CodeEditorProps) {
    const lines = code.split('\n');

    return (
        <View style={styles.container}>
            <View style={styles.editorContainer}>
                {/* Line Numbers */}
                <ScrollView
                    style={styles.lineNumbers}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                >
                    {lines.map((_, index) => (
                        <Text key={index} style={styles.lineNumber}>
                            {index + 1}
                        </Text>
                    ))}
                </ScrollView>

                {/* Code Input */}
                <TextInput
                    style={styles.codeInput}
                    multiline
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.textTertiary}
                    value={code}
                    onChangeText={onCodeChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textAlignVertical="top"
                    scrollEnabled={true}
                />
            </View>

            {/* Language Badge - Interactivo */}
            <Pressable
                style={({ pressed }) => [
                    styles.languageBadge,
                    pressed && { opacity: 0.8 }
                ]}
                onPress={() => {
                    if (onLanguageChange && availableLanguages && availableLanguages.length > 1) {
                        const currentIndex = availableLanguages.indexOf(language);
                        // Asegurar que encontramos el índice, si no default a 0
                        const safeIndex = currentIndex === -1 ? 0 : currentIndex;
                        const nextIndex = (safeIndex + 1) % availableLanguages.length;
                        onLanguageChange(availableLanguages[nextIndex]);
                    }
                }}
            >
                <Text style={styles.languageText}>{language}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray900,
        borderRadius: RADIUS.md,
        overflow: 'hidden',
    },
    editorContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    lineNumbers: {
        backgroundColor: COLORS.gray800,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xs,
        minWidth: 40,
    },
    lineNumber: {
        color: COLORS.textTertiary,
        fontSize: TYPOGRAPHY.sizes.xs,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        lineHeight: 24,
        textAlign: 'right',
        paddingRight: 8,
    },
    codeInput: {
        flex: 1,
        color: COLORS.backgroundLight,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: TYPOGRAPHY.sizes.base,
        padding: SPACING.md,
        lineHeight: 24,
    },
    languageBadge: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.sm,
        zIndex: 10,
    },
    languageText: {
        color: COLORS.textInverse,
        fontSize: TYPOGRAPHY.sizes.xs,
        fontWeight: TYPOGRAPHY.weights.semibold,
        textTransform: 'uppercase',
    },
});
