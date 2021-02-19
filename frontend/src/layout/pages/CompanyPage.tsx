import { useEffect, useState } from "react";
import LabelValue from "../../components/common/LabelValue";
import { SequenceRuleEditor, TransitionRuleEditor } from "../../components/company/RuleEditor";
import { useArraySubject, useSubject } from "../../hooks/useAsyncState";
import { companySubject, sequenceRuleSubject, transitionRuleSubject } from "../../rxjs/company.subject";
import '../../styles/layout/pages/company.scss'

function CompanyPage() {
  const [company] = useSubject(null, companySubject.subject);
  const [sequenceRules] = useArraySubject(null, sequenceRuleSubject.subject);
  const [transitionRules] = useArraySubject(null, transitionRuleSubject.subject);
  const [showNewSeqForm, setShowSeqNewForm] = useState<boolean>(false);
  const [showNewTransForm, setShowTransNewForm] = useState<boolean>(false);

  return (
    <article>
      {
        company ? (
          <section>
            <LabelValue label="ID" value={company.id} />
            <LabelValue label="Name" value={company.name} />
            <div>
              <h3>Sequence Rules</h3>
              {
                showNewSeqForm ? (
                  <SequenceRuleEditor companyId={company.id} onAddRule={() => setShowSeqNewForm(false)} />
                ) : (
                    <button onClick={() => setShowSeqNewForm(true)}>New</button>
                  )
              }
              {
                sequenceRules ? (
                  sequenceRules.map(r => <SequenceRuleEditor key={r.id} rule={r} companyId={company.id} />)
                ) : (<span>{sequenceRules === null ? "..." : 'No rules'}</span>)
              }
            </div>
            <div>
              <h3>Transition Rules</h3>
              {
                showNewTransForm ? (
                  <TransitionRuleEditor companyId={company.id} onAddRule={() => setShowTransNewForm(false)} />
                ) : (
                    <button onClick={() => setShowTransNewForm(true)}>New</button>
                  )
              }
              {
                transitionRules ? (
                  transitionRules.map(r => <TransitionRuleEditor key={r.id} rule={r} companyId={company.id} />)
                ) : (<span>{transitionRules === null ? "..." : 'No rules'}</span>)
              }
            </div>
          </section>
        ) : (
            <span>Loading...</span>
          )
      }

    </article>
  );
}
export default CompanyPage;
