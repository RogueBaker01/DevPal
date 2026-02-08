import React from 'react';
import { View, Text, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY, SHADOWS } from '@/constants/designTokens';

interface AIReviewBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    review: {
        calidad_codigo: number;
        comentarios: string;
        sugerencias_optimizacion?: string;
        codigo_corregido?: string;
    } | null;
}

export function AIReviewBottomSheet({ visible, onClose, review }: AIReviewBottomSheetProps) {
    if (!review) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                    {/* Drag Handle */}
                    <View style={styles.dragHandle} />

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Revisión de IA</Text>
                            <Pressable onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                            </Pressable>
                        </View>

                        {/* Quality Score */}
                        <View style={styles.scoreCard}>
                            <Ionicons name="star" size={32} color={COLORS.warning} />
                            <View style={styles.scoreInfo}>
                                <Text style={styles.scoreLabel}>Calidad del Código</Text>
                                <Text style={styles.scoreValue}>{review.calidad_codigo}/10</Text>
                            </View>
                        </View>

                        {/* Comments */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.primary} />
                                <Text style={styles.sectionTitle}>Análisis</Text>
                            </View>
                            <Text style={styles.sectionText}>{review.comentarios}</Text>
                        </View>

                        {/* Suggestions */}
                        {review.sugerencias_optimizacion && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="rocket" size={20} color={COLORS.success} />
                                    <Text style={styles.sectionTitle}>Sugerencias</Text>
                                </View>
                                <Text style={styles.sectionText}>{review.sugerencias_optimizacion}</Text>
                            </View>
                        )}

                        {/* Corrected Code */}
                        {review.codigo_corregido && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                                    <Text style={styles.sectionTitle}>Código Corregido</Text>
                                </View>
                                <View style={styles.codeBlock}>
                                    <Text style={styles.codeText}>{review.codigo_corregido}</Text>
                                </View>
                            </View>
                        )}
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: COLORS.backgroundLight,
        borderTopLeftRadius: RADIUS['2xl'],
        borderTopRightRadius: RADIUS['2xl'],
        maxHeight: '70%',
        ...SHADOWS.xl,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.gray300,
        borderRadius: RADIUS.sm,
        alignSelf: 'center',
        marginTop: SPACING.md,
        marginBottom: SPACING.sm,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: SPACING.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: TYPOGRAPHY.sizes['2xl'],
        fontWeight: TYPOGRAPHY.weights.bold,
        color: COLORS.textPrimary,
    },
    closeButton: {
        padding: SPACING.sm,
    },
    scoreCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.warning + '10',
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.xl,
        gap: SPACING.lg,
    },
    scoreInfo: {
        flex: 1,
    },
    scoreLabel: {
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    scoreValue: {
        fontSize: TYPOGRAPHY.sizes['3xl'],
        fontWeight: TYPOGRAPHY.weights.bold,
        color: COLORS.warning,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: TYPOGRAPHY.sizes.lg,
        fontWeight: TYPOGRAPHY.weights.semibold,
        color: COLORS.textPrimary,
    },
    sectionText: {
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS.textSecondary,
        lineHeight: 24,
    },
    codeBlock: {
        backgroundColor: COLORS.gray900,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginTop: SPACING.sm,
    },
    codeText: {
        color: COLORS.backgroundLight,
        fontFamily: 'monospace',
        fontSize: TYPOGRAPHY.sizes.sm,
        lineHeight: 20,
    },
});
