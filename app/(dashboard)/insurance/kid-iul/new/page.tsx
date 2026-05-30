import BenefitForm from "../BenefitForm";

export default function NewKidIULBenefitPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-6">
        Thêm quyền lợi mới
      </h1>
      <BenefitForm backHref="/insurance/kid-iul" />
    </div>
  );
}
