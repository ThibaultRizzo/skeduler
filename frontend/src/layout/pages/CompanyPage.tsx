import { useState } from "react";
import LabelValue from "../../components/common/LabelValue";
import { useSubject } from "../../hooks/useAsyncState";
import { companySubject } from "../../rxjs/company.subject";

function CompanyPage() {
  const [company] = useSubject(null, companySubject.subject);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null)
  return (
    <article>
      {
        company ? (
          <section>
            <LabelValue label="ID" value={company.id} />
            <LabelValue label="Name" value={company.name} />
            {

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
