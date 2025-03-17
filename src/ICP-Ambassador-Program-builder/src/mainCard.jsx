import React from "react";

function MaintenanceContent() {
  return (
    <section className="text-white mt-[489px] max-md:mt-10 max-md:max-w-full">
      <h1 className="text-5xl font-bold tracking-tighter max-md:max-w-full max-md:text-4xl">
        Maintenance Mode
      </h1>
      <blockquote className="px-3 mt-4 w-full font-medium border-l border-white border-opacity-60 max-md:max-w-full">
        <p className="text-2xl tracking-tight leading-9">
          We are adding new features:
          <br />
          it will be operational really soon
        </p>
        <p className="mt-2.5 text-xl tracking-tight leading-snug">
          May the force be with you
        </p>
      </blockquote>
    </section>
  );
}

export default MaintenanceContent;
