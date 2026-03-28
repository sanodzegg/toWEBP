import Dropbox from "@/components/files/dropbox";
import FileList from "@/components/files/list";
import ConvertedFiles from "@/components/files/converted";

export default function Homepage() {

  return (
    <section className="section py-8 2xl:py-12">
      <div className="mb-6 2xl:mb-8">
        <h2 className="text-2xl 2xl:text-3xl font-body font-semibold text-foreground">Convert almost anything, instantly.</h2>
        <p className="text-sm 2xl:text-base text-muted-foreground mt-1">
          Images, videos, documents — drag in a file and get it back in the format you need.
        </p>
      </div>
      <Dropbox />
      <FileList />
      <ConvertedFiles />
    </section>
  )
}
