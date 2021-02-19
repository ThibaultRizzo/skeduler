import React, { useState } from "react"
import { CompanySequenceRule, CompanyTransitionRule, RulePenalty, SequenceRuleType } from "../../types"
import { StandardProps } from "../../types/types";
import SequenceRuleForm from "./SequenceRuleForm";
import TransitionRuleForm from "./TransitionRuleForm";


type RuleEditorProps<R = CompanySequenceRule | CompanyTransitionRule> = {
    rule?: R,
    companyId: string
    onAddRule?: () => void
} & StandardProps

const toPenaltyString = (penalty: RulePenalty) => {
    switch (penalty) {
        case RulePenalty.Soft:
            return 'would rather avoid'
        case RulePenalty.Medium:
            return 'condamn'
        case RulePenalty.Hard:
            return 'forbid'
    }
}

const renderRule = (rule: CompanySequenceRule) => {
    const isHardRule = (rule: CompanySequenceRule) => rule.softMin === rule.hardMin && rule.softMax === rule.hardMax
    if (!rule) {
        return null
    }
    switch (rule.ruleType) {
        default:
        case SequenceRuleType.ShiftSequence:
            return (
                <div>
                    <span>{`
                    For ${rule.shiftId || 'resting'}, i want ${isHardRule(rule) ? 'exactly' : 'at most'} between ${rule.softMin} and ${rule.softMax} days in a row.
                    `}</span>
                    {
                        !isHardRule(rule) && (
                            <>
                                {
                                    rule.softMin !== rule.hardMin && (
                                        <span>{`Down to ${rule.hardMin} day is tolerated but ${toPenaltyString(rule.penaltyMin)}`}</span>
                                    )
                                }
                                {
                                    rule.softMax !== rule.hardMax && (
                                        <span>{`Up to ${rule.hardMax} day is tolerated but ${toPenaltyString(rule.penaltyMax)}`}</span>
                                    )
                                }
                            </>
                        )
                    }
                </div >
            )
        case SequenceRuleType.ShiftSumSequence:
            return (
                <div>
                    <span>{`
                    I want each employee to ${rule.shiftId ? `work as ${rule.shiftId}` : 'rest'} ${isHardRule(rule) ? 'exactly' : 'at most'} between ${rule.softMin} and ${rule.softMax} times per week .
                    `}</span>
                    {
                        !isHardRule(rule) && (
                            <>
                                {
                                    rule.softMin !== rule.hardMin && (
                                        <span>{`Down to ${rule.hardMin} day is tolerated but ${toPenaltyString(rule.penaltyMin)}`}</span>
                                    )
                                }
                                {
                                    rule.softMax !== rule.hardMax && (
                                        <span>{`Up to ${rule.hardMax} day is tolerated but ${toPenaltyString(rule.penaltyMax)}`}</span>
                                    )
                                }
                            </>
                        )
                    }
                </div >
            )
    }
}


export const SequenceRuleEditor = ({ rule, companyId, onAddRule }: RuleEditorProps<CompanySequenceRule>) => {
    const [isForm, setForm] = useState<boolean>(!rule);
    function onSubmit() {
        if (!rule && onAddRule) {
            onAddRule();
        }
        setForm(false)
    }
    return isForm ? (
        <SequenceRuleForm companyId={companyId} rule={rule} onSubmit={onSubmit} />
    ) : (
            <div onClick={() => setForm(true)}>
                {renderRule(rule as CompanySequenceRule)}
            </div>
        )
}

export const TransitionRuleEditor = ({ rule, companyId, onAddRule }: RuleEditorProps<CompanyTransitionRule>) => {
    const [isForm, setForm] = useState<boolean>(!rule);
    function onSubmit() {
        if (!rule && onAddRule) {
            onAddRule();
        }
        setForm(false)
    }
    return isForm ? (
        <TransitionRuleForm companyId={companyId} rule={rule} onSubmit={onSubmit} />
    ) : (
            <div onClick={() => setForm(true)}>
                <span>{`
                    I ${toPenaltyString(rule!.penalty)} transition between ${rule!.fromShiftId || 'resting'} and ${rule!.toShiftId || 'resting'}
                    `}</span>
            </div>
        )
}

