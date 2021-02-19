import { useState } from "react";
import LabelValue from "../../components/common/LabelValue";
import { useArraySubject, useSubject } from "../../hooks/useAsyncState";
import { companySubject, sequenceRuleSubject, transitionRuleSubject } from "../../rxjs/company.subject";

function CompanyPage() {
  const [company] = useSubject(null, companySubject.subject);
  const [sequenceRules] = useArraySubject(null, sequenceRuleSubject.subject);
  const [transitionRules] = useArraySubject(null, transitionRuleSubject.subject);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null)
  return (
    <article>
      {
        company ? (
          <section>
            <LabelValue label="ID" value={company.id} />
            <LabelValue label="Name" value={company.name} />
            {
              sequenceRules ? (
                sequenceRules.map(r => r.id)
              ) : (<span>...</span>)
            }
            {
              transitionRules ? (
                transitionRules.map(r => r.id)
              ) : (<span>...</span>)
            }
            {/* <RuleEditor rule={rule} /> */}
          </section>
        ) : (
            <span>Loading...</span>
          )
      }

    </article>
  );
}
export default CompanyPage;
