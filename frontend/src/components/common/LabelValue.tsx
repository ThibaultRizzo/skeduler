type LabelValueProps = {
  label: string;
  value?: string | number | null;
};

const LabelValue = ({ label, value }: LabelValueProps) => {
  return (
    <p>
      <b>{label}:</b>
      <span>{value || "-"}</span>
    </p>
  );
};

export default LabelValue;
