type SnapshotCardProps = {
  title: string;
  value: string;
  description?: string;
};

export default function SnapshotCard({
  title,
  value,
  description,
}: SnapshotCardProps) {
  return (
    <article className="rounded-[28px] border border-[#bfe8f3] bg-[#d9f0ec] p-6 shadow-sm">
      <p className="text-sm font-medium text-[#0ea5ea]">{title}</p>
      <p className="mt-3 text-2xl font-bold tracking-tight text-[#121b33]">
        {value}
      </p>
      {description ? (
        <p className="mt-4 text-sm leading-7 text-[#4b6275]">{description}</p>
      ) : null}
    </article>
  );
}