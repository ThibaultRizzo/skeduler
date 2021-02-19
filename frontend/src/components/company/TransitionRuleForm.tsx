import { ErrorDictionary } from "../../hooks/useValidation";
import { transitionRuleToDraft } from "../../model";
import { transitionRuleSubject } from "../../rxjs/company.subject";
import { CompanyTransitionRule, CreateTransitionRuleInput, RulePenalty, Shift } from "../../types";
import { rulePenaltyFactory } from "../../utils/enum";
import CRUDForm, { FormField, FormFieldType } from "../common/CRUDForm";
import ShiftSelect from "../common/select/ShiftSelect";

type TransitionRuleFormProps = {
    companyId: string;
    rule?: CompanyTransitionRule;
    onSubmit: () => void
};

function TransitionRuleForm({ rule, companyId, onSubmit }: TransitionRuleFormProps) {
    const initialState: CreateTransitionRuleInput = rule
        ? transitionRuleToDraft(rule)
        : {
            companyId,
            penalty: RulePenalty.Soft,
            fromShiftId: null,
            toShiftId: null
        };

    function validateForm(): ErrorDictionary {
        const errors: ErrorDictionary = {};
        // if (.some((e) => e.name === employee.name)) {
        //   errors["employee"] = "An employee with same name already exists";
        // }

        return errors;
    }

    const fields: FormField<CreateTransitionRuleInput>[] = [
        {
            type: FormFieldType.ENUM_SINGLE,
            id: "penalty-select",
            name: "penalty",
            factory: rulePenaltyFactory
        }

    ];
    return (
        <section>
            {rule && <button onClick={() => onSubmit()}>Cancel</button>}
            {rule && <button onClick={() => transitionRuleSubject.deleteOne(rule.id)}>Delete</button>}
            <CRUDForm<CreateTransitionRuleInput>
                createOne={r => transitionRuleSubject.createOne({ ...r, companyId }) && onSubmit()}
                updateOne={({ companyId, ...d }) => transitionRuleSubject.updateOne({ id: rule!.id, companyId, ...d }) && onSubmit()}
                isCreation={!rule}
                name="transition-rule-form"
                initialState={initialState}
                validateForm={validateForm}
                fields={fields}
            >
                {(rule, setRule) => (
                    <>
                        <ShiftSelect
                            id="from-shift-select"
                            onChange={(shift: Shift) => {
                                setRule({ ...rule, fromShiftId: shift.id });
                            }}
                            withRest
                        />
                        <ShiftSelect
                            id="to-shift-select"
                            onChange={(shift: Shift) => {
                                setRule({ ...rule, toShiftId: shift.id });
                            }}
                            withRest
                        />

                    </>
                )}
            </CRUDForm>
        </section>
    );
}

export default TransitionRuleForm;
