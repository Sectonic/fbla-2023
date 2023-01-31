
function Home() {
  return (
    <div>
        <main>
        <div className="relative pt-16 pb-32 flex content-center items-center justify-center"
            style={{
              minHeight: "75vh"
            }}>
          <div className="absolute top-0 w-full h-full bg-center bg-cover"
              style={{
                backgroundImage: "url('/img/front_bg.avif')"
              }}>
            <span id="blackOverlay" className="w-full h-full absolute opacity-75 bg-black"></span>
          </div>
          <div className="container relative mx-auto">
              <div className="items-center flex flex-wrap">
                <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                    <h1 className="text-white font-semibold text-5xl">
                      EventPrizer: An FBLA Project
                    </h1>
                    <p className="mt-4 text-lg text-gray-300">
                      This is a web app designed to award students prizes through the attendance of events and earning points
                    </p>
                    <a href="/register"><button className="btn btn-primary mt-4">Get Started</button></a>
                </div>

              </div>
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
            style={{ height: "70px" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-base-100 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </div>
        <section className="pt-20 pb-32">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center text-center mb-24">
              <div className="w-full lg:w-6/12 px-4">
                <h2 className="text-4xl font-semibold">
                  Here is how it was created
                </h2>
                <p className="text-lg leading-relaxed m-4 text-gray-600">
                  This is the stack used to create EventPrizer. These are all the libraries and frameworks used.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-5">
              <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                <div className="px-6">
                  <div className="shadow-lg rounded-full w-[130px] h-[130px] p-2 mx-auto">
                    <img
                      alt="..."
                      src="/img/react.svg"
                    />
                  </div>
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">
                      React
                    </h5>
                    <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                      Frontend Framework
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                <div className="px-6">
                  <div className="shadow-lg rounded-full w-[130px] h-[130px] p-2 mx-auto">
                    <img
                      alt="..."
                      src="/img/tailwind.svg"
                    />
                  </div>
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">
                      Tailwind
                    </h5>
                    <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                      CSS Framework
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                <div className="px-6">
                  <div className="shadow-lg rounded-full w-[130px] h-[130px] p-2 mx-auto">
                    <img
                      alt="..."
                      className="rounded-full"
                      src="/img/daisyui.png"
                    />
                  </div>
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">
                      DaisyUI
                    </h5>
                    <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                      Tailwind Components
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                <div className="px-6">
                  <div className="shadow-lg rounded-full w-[130px] h-[130px] p-2 mx-auto">
                    <img
                      alt="..."
                      src="/img/sqlite.svg"
                    />
                  </div>
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">
                      SQLite
                    </h5>
                    <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                      SQL Database
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                <div className="px-6">
                  <div className="shadow-lg rounded-full w-[130px] h-[130px] p-2 mx-auto">
                    <img
                      alt="..."
                      src="/img/flask.svg"
                    />
                  </div>
                  <div className="pt-6 text-center">
                    <h5 className="text-xl font-bold">
                      Flask
                    </h5>
                    <p className="mt-1 text-sm text-gray-500 uppercase font-semibold">
                      Backend API
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;