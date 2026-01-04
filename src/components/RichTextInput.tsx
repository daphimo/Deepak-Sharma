type Props = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
};

export function RichTextInput({ label, value, onChange, className = "" }: Props) {
  return (
    <div className={className}>
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <textarea
        className="w-full rounded-lg border border-gray-200 bg-white p-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-100"
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter rich text..."
      />
    </div>
  );
}

export default RichTextInput;
