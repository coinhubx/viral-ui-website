import ComponentForm from "@/components/ComponentForm";
import Header from "@/components/Header";

function HomePage() {
  return (
    <main className="flex flex-col items-center">
      <Header />

      <ComponentForm />
    </main>
  );
}

export default HomePage;
