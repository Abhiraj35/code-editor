import { deleteProjectById, duplicateProjectById, editProjectById, getAllPlaygroundForUser } from "@/modules/dashboard/actions";
import AddNewButton from "@/modules/dashboard/components/add-new";
import AddRepo from "@/modules/dashboard/components/add-repo";
import EmptyState from "@/modules/dashboard/components/empty-state";
import ProjectTable from "@/modules/dashboard/components/project-table";
import React from "react";

const Page = async () => {
    const playgrounds = await getAllPlaygroundForUser();
    // console.log("Playgrounds:", playgrounds);
    return (
        <div className="flex flex-col justify-start items-center min-h-screen w-full min-w-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 overflow-x-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
                <AddNewButton />
                <AddRepo />
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col justify-center items-center w-full min-w-0">
                {playgrounds && playgrounds.length === 0 ? (
                    <EmptyState />
                ) : (
                    <ProjectTable
                        projects={playgrounds || []}
                        onDeleteProject={deleteProjectById}
                        onUpdateProject={editProjectById}
                        onDuplicateProject={duplicateProjectById}
                    />
                )}
            </div>
        </div>
    );
};

export default Page;
