import axios from "axios";
import { useState } from "react"


export const Card = () => {

    const [repoUrl, setRepoUrl] = useState("")
    const [uploadId, setUploadId] = useState("")
    const [uploading, setUploading] = useState(false);
    const [deployed, setDeployed] = useState(false);

    const BACKEND_UPLOAD_URL =  import.meta.env.VITE_BACKEND_UPLOAD_URL;

    return (
        <div>
            <div className="flex justify-center">
                <div className="flex flex-col justify-center min-h-[calc(100vh-64px)]">


                    <div className="h-60 min-w-96 border rounded-xl shadow p-5">
                        <div className="flex flex-col justify-between h-full">
                            <div className="">
                                <div className="text-lg font-bold"> Deploy your GitHub Repository</div>
                                <div className="text-sm text-slate-400 font-medium"> Enter the URL of your GitHub repository to deploy it</div>
                            </div>

                            <div className="">
                                <div className="text-md font-semibold">GitHub repository URL</div>
                                <div className="w-full max-w-sm min-w-[200px]">
                                    <input onChange={(e) => {
                                        setRepoUrl(e.target.value);
                                    }} className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Type here..." />
                                </div>
                            </div>

                            <div className="">
                                <button onClick={async () => {
                                    setUploading(true);
                                    const res = await axios.post(`${BACKEND_UPLOAD_URL}/deploy`, {
                                        repoUrl: repoUrl
                                    });

                                    console.log(res.data);

                                    setUploadId(res.data.id);
                                    setUploading(false);

                                    const interval = setInterval(async () => {
                                        const response = await axios.get(`${BACKEND_UPLOAD_URL}/status?id=${res.data.id}`);

                                        if (response.data.status === "Deployed") {
                                            clearInterval(interval);
                                            setDeployed(true);
                                        }
                                    }, 3000);


                                }} disabled={uploadId !== "" || uploading} className="w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" type="button">
                                    {uploadId ? `Deploying (${uploadId})` : uploading ? "Uploading..." : "Upload"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {
                    deployed && <div className="h-60 min-w-96 border rounded-xl shadow p-5">
                        <div className="flex flex-col justify-between h-full">
                            <div className="">
                                <div className="text-lg font-bold"> Deployed</div>
                                <div className="text-sm text-slate-400 font-medium">Your repository is successfully deployed!</div>
                            </div>
                            <div className="">
                                <div className="text-md font-semibold">Deployment URL</div>
                                <div className="w-full max-w-sm min-w-[200px]">
                                <input className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                value={`http://${uploadId}.vercel.lolice.tech:3001/index.html`}/>
                                </div>
                            </div>
                            <div className="">
                                <button className="w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" type="button">
                                    Go to Deployment
                                </button>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
            </div>
            )
}