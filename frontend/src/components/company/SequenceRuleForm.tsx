import { ErrorDictionary } from "../../hooks/useValidation";
import { sequenceRuleToDraft } from "../../model";
import { sequenceRuleSubject } from "../../rxjs/company.subject";
import { CompanySequenceRule, CreateSequenceRuleInput, RulePenalty, SequenceRuleType, Shift } from "../../types";
import { rulePenaltyFactory, sequenceRuleTypeFactory } from "../../utils/enum";
import CRUDForm, { FormField, FormFieldType } from "../common/CRUDForm";
import ShiftSelect from "../common/select/ShiftSelect";

type SequenceRuleFormProps = {
    companyId: string;
    rule?: CompanySequenceRule;
    onSubmit: () => void
};

function SequenceRuleForm({ rule, companyId, onSubmit }: SequenceRuleFormProps) {
    const initialState: CreateSequenceRuleInput = rule
        ? sequenceRuleToDraft(rule)
        : {
            shiftId: null,
            companyId,
            ruleType: SequenceRuleType.ShiftSequence,
            hardMax: 7,
            softMax: 7,
            penaltyMax: RulePenalty.Soft,
            softMin: 0,
            hardMin: 0,
            penaltyMin: RulePenalty.Soft
        };

    function validateForm(): ErrorDictionary {
        const errors: ErrorDictionary = {};
        // if (.some((e) => e.name === employee.name)) {
        //   errors["employee"] = "An employee with same name already exists";
        // }

        return errors;
    }

    const fields: FormField<CreateSequenceRuleInput>[] = [
        {
            type: FormFieldType.ENUM_SINGLE,
            id: "rule-select",
            name: "ruleType",
            factory: sequenceRuleTypeFactory,
            props: {
                disabled: Boolean(rule),
            }
        },
        {
            type: FormFieldType.NUMBER,
            id: "hard-max-input",
            name: "hardMax",
        },
        {
            type: FormFieldType.NUMBER,
            id: "soft-max-input",
            name: "softMax",
        },
        {
            type: FormFieldType.ENUM_SINGLE,
            id: "penalty-max-select",
            name: "penaltyMax",
            factory: rulePenaltyFactory
        },
        {
            type: FormFieldType.NUMBER,
            id: "hard-min-input",
            name: "hardMin",
        },
        {
            type: FormFieldType.NUMBER,
            id: "soft-min-input",
            name: "softMin",
        },
        {
            type: FormFieldType.ENUM_SINGLE,
            id: "penalty-min-select",
            name: "penaltyMin",
            factory: rulePenaltyFactory
        },

    ];
    return (
        <section>
            {rule && <button onClick={() => onSubmit()}>Cancel</button>}
            {rule && <button onClick={() => sequenceRuleSubject.deleteOne(rule.id)}>Delete</button>}
            <CRUDForm<CreateSequenceRuleInput>
                createOne={r => sequenceRuleSubject.createOne({ ...r, companyId }) && onSubmit()}
                updateOne={({ companyId, ruleType, ...d }) => sequenceRuleSubject.updateOne({ id: rule!.id, ...d }) && onSubmit()}
                isCreation={!rule}
                name="sequence-rule-form"
                initialState={initialState}
                validateForm={validateForm}
                fields={fields}
            >
                {(rule, setRule) => (
                    <>
                        <ShiftSelect
                            id="rule-shift-select"
                            onChange={(shift: Shift) => {
                                setRule({ ...rule, shiftId: shift.id });
                            }}
                        />

                    </>
                )}
            </CRUDForm>
        </section>
    );
}

export default SequenceRuleForm;
