import { FaGithub } from "react-icons/fa6";

export const Appbar = () => {
    return (
        <div className="flex justify-between p-4 font-bold bg-black items-center">

            <div className="text-2xl text-white">
                LoliceVercel
            </div>
            <div>
                <div className="text-white px-5 space-x-5 flex items-center hover:cursor-pointer">

                    <a className="text-2xl" href="https://github.com/Elektrikk">
                        <div>
                            <FaGithub />
                        </div>
                    </a>

                </div>
            </div>


        </div>


    )
}