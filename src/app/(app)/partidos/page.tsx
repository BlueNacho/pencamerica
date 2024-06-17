import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import Image from "next/image";
import { fetchMatchesDisplayed } from "@/data/matches";
import { MatchDisplayed, User } from "@/types/types";
import { formatDateToLocal } from "@/lib/utils";
import { getUserByEmail } from "@/data/users";
import { getSession } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

export default async function Page() {

    const session = await getSession();
    const matches: MatchDisplayed[] = await fetchMatchesDisplayed(session.user?.id);

    return (
        <div className="flex flex-col max-h-full gap-6 md:grid md:grid-cols-2">
            {matches.map((match, index) => (
                <Link href={`/partidos/${match.id}`} key={index}>
                    <Card key={index} className="h-max transition-all xl:hover:scale-[101%] xl:hover:border-primary focus:scale-[100%] focus:border group relative">
                        <span className={clsx("absolute right-0",
                            match.status === "finalizado" ? "bg-emerald-600" : match.status === "jugándose" ? "bg-amber-600" : "bg-gray-500",
                            "text-white text-xs font-semibold px-2 rounded-bl-md rounded-tr-md"
                        )}>{match.status}</span>
                        <CardContent className="py-3 px-8 flex flex-row justify-between items-center">
                            <div className="flex flex-col items-center justify-center w-1/3">
                                <div className="flex flex-col items-center gap-1">
                                    <Image src={`https://flagcdn.com/${match.home_team_code}.svg`}
                                        alt="Team Image"
                                        width={1920}
                                        height={1080}
                                        priority
                                        className="object-cover object-center rounded-lg w-16 h-12 shadow-md"
                                    />
                                    <span className="font-medium text-sm lg:text-lg text-nowrap">{match.home_team_name}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center w-1/3 gap-1">
                                <span className="text-4xl font-black bg-clip-text text-transparent rounded-xl text-center bg-gradient-to-tr from-blue-600 to-blue-400">VS</span>
                                {match.prediction_away_team_goals !== null && match.prediction_home_team_goals !== null ? (
                                    <span className="text-lg font-semibold text-white bg-primary px-2 rounded-full">{match.prediction_home_team_goals} : {match.prediction_away_team_goals}</span>
                                ) : (
                                    <span className="dark:text-white p-1.5 h-max rounded-md bg-primary/20 xl:group-hover:bg-primary transition-all group-active:bg-primary text-xs">Predecir</span>
                                )}

                            </div>

                            <div className="flex flex-col items-center justify-center w-1/3">
                                <div className="flex flex-col items-center gap-1">
                                    <Image src={`https://flagcdn.com/${match.away_team_code}.svg`}
                                        alt="Team Image"
                                        width={1920}
                                        height={1080}
                                        priority
                                        className="object-cover object-center rounded-lg w-16 h-12 shadow-md"
                                    />
                                    <span className="font-medium text-sm lg:text-lg text-nowrap">{match.away_team_name}</span>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="border-t px-4 py-1 flex flex-row justify-between text-sm font-semibold rounded-b-md bg-primary/20">
                            <span>{formatDateToLocal(match.start_time)}hs</span>

                            <div className="text-nowrap">
                                <span className="uppercase">GRUPO {match["group_name"]}</span>
                                <span>&nbsp; - &nbsp;</span>
                                <span className="uppercase">{match.phase}</span>
                            </div>
                        </CardFooter>
                    </Card>
                </Link>
            ))
            }
        </div >
    );
}