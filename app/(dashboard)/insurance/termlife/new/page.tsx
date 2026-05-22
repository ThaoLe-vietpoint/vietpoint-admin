import BenefitForm from "../../kid-iul/BenefitForm";

export default function NewTermLifeBenefitPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-slate-100 mb-6">
        Thêm quyền lợi mới
      </h1>
      <BenefitForm backHref="/insurance/termlife" />
    </div>
  );
}
