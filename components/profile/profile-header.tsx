interface IProps {
  title: string;
}

export const ProfileHeader = ({ title }: IProps) => {
  return (
    <header className="flex flex-row items-center gap-1">
      <h3 className="text-[#1C1939] font-medium font-inter">{title}</h3>
      <span className="text-red-500">*</span>
    </header>
  );
};
