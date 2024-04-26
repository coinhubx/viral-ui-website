function NotFoundPage() {
  return (
    <main className="mt-10 flex flex-col items-center px-4">
      <div className="absolute top-[40%] -translate-y-1/2 text-center">
        <h1 className="mb-2 text-4xl font-semibold text-foreground">
          404 Error
        </h1>
        <p className="text-muted-foreground">This page doesn't exist</p>
      </div>
    </main>
  );
}

export default NotFoundPage;
