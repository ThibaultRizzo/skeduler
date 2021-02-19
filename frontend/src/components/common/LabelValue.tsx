type LabelValueProps = {
  label: string;
  value?: string | number | null;
};

const LabelValue = ({ label, value }: LabelValueProps) => {
  return (
    <p>
      <b>{label}:</b>
      <span>{value || value === 0 ? value : "-"}</span>
    </p>
  );
};

export default LabelValue;
