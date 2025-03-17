import React from "react";
import MaintenanceContent from "./mainCard";

function MaintenanceMode() {
  return (
    <main className="flex overflow-hidden flex-col pt-5  bg-violet-950">
      <div className="z-10 self-center w-full max-w-[1228px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <section className="w-[65%] max-md:ml-0 max-md:w-full">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/3d5b5fbe3a9d3709126ab93fee568cc6d129b16b3bbcc56a25a7b434e5701336?placeholderIfAbsent=true&apiKey=8455f33b6f5e4200ba1fe454ca4e8d78"
              alt="Maintenance illustration"
              className="object-contain grow w-full aspect-[0.93] max-md:mt-2.5 max-md:max-w-full"
            />
          </section>
          <section className="ml-5 w-[35%] max-md:ml-0 max-md:w-full">
            <MaintenanceContent />
          </section>
        </div>
      </div>
      <footer className="flex w-full rounded-full bg-violet-950 min-h-[158px] max-md:max-w-full" />
    </main>
  );
}

export default MaintenanceMode;
