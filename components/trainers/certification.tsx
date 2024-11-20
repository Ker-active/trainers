import Image from "next/image";
import { useFormContext } from "react-hook-form";
import DocViewer from "react-doc-viewer";

export const Certification = () => {
  const form = useFormContext();

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      form.setValue("certification", e.target.files[0]);
    }
  }
  const certification = form.watch("certification");

  const source = certification ? (typeof certification === "string" ? certification : URL.createObjectURL(certification)) : "";

  return (
    <article className="flex h-full bg-white px-[20px] py-[15px] rounded-[8px] flex-col gap-4">
      <header>
        <h3 className="text-[#1C1939] font-medium font-inter">Certification</h3>
      </header>
      <hr />
      <div className="flex items-center py-4 justify-center flex-col h-full">
        <Image width={80} height={80} alt="Certificate Svg" src="/certificate.svg" />
        {/* <DocViewer style={{ background: "white", border: "1px solid #eee" }} documents={[{ uri: source }]} /> */}
        <div className="w-full flex text-[13px] flex-col">
          <p className=" line-clamp-1 w-full text-center leading-[20px] text-[#5B5971]">
            {certification ? (typeof certification === "string" ? certification : certification.name) : "You do not have any certification yet,"}{" "}
          </p>
          <button onClick={() => document.getElementById("certification")?.click()} type="button" className="text-primary underline">
            {certification ? "Reupload" : "Upload"} Certificate
          </button>
        </div>
      </div>
      <input onChange={handleImageChange} hidden accept="image/*" type="file" id="certification" />
    </article>
  );
};
