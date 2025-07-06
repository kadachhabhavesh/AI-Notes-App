export default () => {
    return (
        <div className="w-full bg-gray-100 font-itim">
            <div className="flex flex-col items-center justify-center min-h-screen ">
                <div className="flex items-center justify-center gap-3 text-sm text-blue-700 font-medium bg-blue-50 border border-blue-300 rounded-full px-4 py-1.5 mb-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-4 h-4"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
                    AI-Powered Problem Solving
                </div>

                <div className="flex flex-col items-center justify-center font-bold text-7xl mb-10">
                    <h1>Draw Your Problem.</h1> 
                    <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        Get the Solution.
                    </h1>
                </div>

                <p className="text-gray-700 text-2xl mb-10 max-w-2xl text-center">
                    Transform your hand-drawn math problems, algorithms, and diagrams into comprehensive step-by-step solutions powered by advanced AI.
                </p>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-14 pt-2.5 pb-3 text-white font-semibold text-xl rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                    Try Now
                </button>

                {/* random box */}
                <div className="w-24 aspect-square bg-blue-300 rounded-xl absolute top-20 left-16 opacity-20 animate-spin [animation-duration:10s] overflow-visible"></div>
                <div className="w-28 aspect-square bg-purple-300 rounded-xl absolute bottom-20 right-16 -rotate-6 opacity-20 animate-bounce [animation-duration:2s]"></div>
            </div>

            <div className="flex flex-col items-center justify-center mb-40">
                <h1 className="text-5xl font-semibold mb-5">Visolve.ai Demo</h1>
                <p className="text-gray-700 text-xl max-w-2xl text-center">Use the canvas below to draw your problem. Our AI will analyze your drawing and provide detailed solutions.</p>
                <div className="w-9/12 h-[600px] mt-10 bg-white shadow-2xl rounded-lg p-5">
                    {/* video */}
                </div>
            </div>

            <div className="flex flex-col items-center justify-center h-screen mt-10">
                <h1 className="text-5xl font-semibold mb-5">How Visolve.ai Works</h1>
                <p className="text-gray-700 text-xl max-w-2xl text-center">Three simple steps to transform your drawings into comprehensive solutions.</p>
                <div className="flex flex-col gap-8 w-9/12 p-5 mt-10">
                    <div className="flex items-center gap-8 it bg-white shadow-2xl rounded-3xl p-5">
                        <div class="min-w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen-tool w-10 h-10 text-white"><path d="m12 19 7-7 3 3-7 7-3-3z"></path><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="m2 2 7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg></div>
                        <div>
                            <h2 className="text-2xl font-semibold">1. Draw Your Problem</h2>
                            <p className="text-gray-600">Use our intuitive drawing canvas to sketch your problem. Whether it's a mathematical equation, a data structure, or an abstract concept, our platform understands what you draw.</p>
                        </div>
                    </div>
                    <div className="flex justify-center gap-8 bg-white shadow-2xl rounded-3xl p-5">
                        <div class="min-w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain w-10 h-10 text-white"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path></svg></div>
                        <div>
                            <h2 className="text-2xl font-semibold">2. Ask Your Question</h2>
                            <p className="text-gray-600">Once you've drawn your problem, simply ask a question about it. Our AI understands the context of your drawing and can answer specific questions about it.</p>
                        </div>
                    </div>
                    <div className="flex justify-center gap-8 bg-white shadow-2xl rounded-3xl p-5">
                        <div class="min-w-20 h-20 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text w-10 h-10 text-white"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg></div>
                        <div>
                            <h2 className="text-2xl font-semibold">3. Get Your Solution</h2>
                            <p className="text-gray-600">Our AI analyzes your drawing and question, then provides a detailed response. You'll receive explanations, step-by-step solutions, and visual aids to help you understand.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center mt-10">
                <h1 className="text-5xl font-semibold mb-5">About Visolve.ai</h1>
                <p className="text-gray-700 text-xl max-w-2xl text-center">We believe that learning should be intuitive and accessible. Draw AI bridges the gap between visual thinking and mathematical problem-solving, making complex concepts easier to understand through the natural act of drawing.</p>
                <div className="grid grid-cols-3 gap-8 w-9/12 my-20">
                    <div className="flex flex-col justify-start items-center bg-white p-5 rounded-xl shadow-lg">
                        <div class="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target w-8 h-8 text-white"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg></div>
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold mt-3">Precision AI</h2>
                            <p className="text-gray-600">Advanced machine learning models trained on millions of mathematical problems and solutions</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-center bg-white p-5 rounded-xl shadow-lg">
                        <div class="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users w-8 h-8 text-white"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold mt-3">For Everyone</h2>
                            <p className="text-gray-600">From students learning algebra to professionals solving complex engineering problems</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-center bg-white p-5 rounded-xl shadow-lg">
                        <div class="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap w-8 h-8 text-white"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></div>
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold mt-3">Instant Results</h2>
                            <p className="text-gray-600">Get comprehensive solutions in seconds, not hours of manual calculation</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center bg-gradient-to-r from-blue-700 to-purple-700 text-white p-7 rounded-xl shadow-lg text-center w-9/12">
                    <h1 className="text-4xl font-semibold mb-5">Our Vision</h1>
                    <p className="max-w-2xl text-xl font-light">To democratize problem-solving by making advanced AI accessible through the most natural human interface: drawing. We envision a world where anyone can visualize their thoughts and instantly receive expert-level guidance.</p>
                </div>
            </div>

            <div className="flex flex-col items-center bg-[#0F172A] p-10 mt-24">
                <div className="grid grid-cols-3 gap-8 border-b border-slate-600 w-9/12 py-10">
                    <div className="">
                        <h1 className="text-3xl font-semibold text-white mb-3">Visolve.ai</h1>
                        <p className="text-gray-300">Transforming visual thinking into actionable solutions.</p>
                    </div>
                    <div className="text-gray-300 flex flex-col items-start">
                        <h4 className="mb-3 text-xl text-white">Quick Links</h4>
                        <a href="#">Home</a>
                        <a href="#">About</a>
                        <a href="#">Contact</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                    <div className="text-gray-300 flex flex-col items-start">
                        <h4 className="mb-3 text-xl text-white">Connect With Us</h4>
                        <div class="flex gap-3">
                            <a href="#" aria-label="GitHub" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border bg-background hover:bg-accent h-10 w-10 border-slate-600 text-slate-300 hover:text-white hover:border-white transition-all duration-200"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github w-4 h-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg></a>
                            <a href="#" aria-label="Twitter" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border bg-background hover:bg-accent h-10 w-10 border-slate-600 text-slate-300 hover:text-white hover:border-white transition-all duration-200"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-twitter w-4 h-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a>
                            <a href="#" aria-label="LinkedIn" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border bg-background hover:bg-accent h-10 w-10 border-slate-600 text-slate-300 hover:text-white hover:border-white transition-all duration-200"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                            <a href="#" aria-label="Email" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border bg-background hover:bg-accent h-10 w-10 border-slate-600 text-slate-300 hover:text-white hover:border-white transition-all duration-200"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail w-4 h-4"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></a></div>
                    </div>
                </div>
                <div className="text-gray-400 text-center p-5 w-9/12">© 2024 Draw AI. All rights reserved. Built with ❤️ for problem solvers everywhere.</div>
            </div>
        </div>
    );
}
