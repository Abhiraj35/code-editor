"use client";

import Image from "next/image";
import { format } from "date-fns";
import type { Project } from "../types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import {
  MoreHorizontal,
  Edit3,
  Trash2,
  ExternalLink,
  Copy,
  Link2,
  Eye,
  Calendar,
  FolderOpen,
} from "lucide-react";
import { toast } from "sonner";
import { MarkedToggleButton } from "./marked-toggle";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface ProjectTableProps {
  projects: Project[];
  onUpdateProject?: (
    id: string,
    data: { title: string; description: string }
  ) => Promise<{ success?: boolean; error?: string } | void>;
  onDeleteProject?: (id: string) => Promise<{ success?: boolean; error?: string } | void>;
  onDuplicateProject?: (id: string) => Promise<{ error?: string } | unknown>;
}

interface EditProjectData {
  title: string;
  description: string;
}

export default function ProjectTable({
  projects,
  onUpdateProject,
  onDeleteProject,
  onDuplicateProject,
}: ProjectTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editData, setEditData] = useState<EditProjectData>({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setEditData({
      title: project.title,
      description: project.description ?? "",
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = async (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const handleUpdateProject = async () => {
    if (!selectedProject || !onUpdateProject) return;

    setIsLoading(true);

    try {
      const result = await onUpdateProject(selectedProject.id, editData);
      if (result && "error" in result) {
        toast.error("Failed to update project");
        return;
      }
      setEditDialogOpen(false);
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error("Failed to update project");
      console.error("Error updating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject || !onDeleteProject) return;

    setIsLoading(true);
    try {
      const result = await onDeleteProject(selectedProject.id);
      if (result && "error" in result) {
        toast.error("Failed to delete project");
        return;
      }
      setDeleteDialogOpen(false);
      setSelectedProject(null);
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error("Error deleting project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicateProject = async (project: Project) => {
    if (!onDuplicateProject) return;

    setIsLoading(true);
    try {
      const result = await onDuplicateProject(project.id);
      if (result && typeof result === "object" && "error" in result) {
        toast.error("Failed to duplicate project");
        return;
      }
      toast.success("Project duplicated successfully");
    } catch (error) {
      toast.error("Failed to duplicate project");
      console.error("Error duplicating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyProjectUrl = (projectId: string) => {
    const url = `${window.location.origin}/playground/${projectId}`;

    try {
      navigator.clipboard.writeText(url);
      toast.success("Project URL copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy URL to clipboard");
    }
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
              <TableHead className="font-semibold text-foreground">Project</TableHead>
              <TableHead className="font-semibold text-foreground">Template</TableHead>
              <TableHead className="font-semibold text-foreground">Created</TableHead>
              <TableHead className="font-semibold text-foreground">User</TableHead>
              <TableHead className="w-[50px] text-right font-semibold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {projects.map((project, index) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={cn(
                    "group transition-colors hover:bg-muted/50 border-b border-border/50 last:border-0 h-16",
                  )}
                >
                  <TableCell className="font-medium">
                    <div className="flex flex-col gap-1 py-1">
                      <Link
                        href={`/playground/${project.id}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2 group/link"
                      >
                        <FolderOpen className="h-4 w-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                        <span className="line-clamp-1">{project.title}</span>
                      </Link>
                      {project.description && (
                        <span className="text-sm text-muted-foreground line-clamp-1 pl-6">
                          {project.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20 font-medium"
                    >
                      {project.template}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{format(new Date(project.createdAt), "MMM dd, yyyy")}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-background shadow-sm">
                        <Image
                          src={project.user.image ?? "/placeholder.svg"}
                          alt={project.user.name ?? "User"}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium">{project.user.name ?? "Unknown"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem asChild>
                          <MarkedToggleButton markedForRevision={project.Starmark?.[0]?.isMarked ?? false} id={project.id} />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/playground/${project.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Open Project
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/playground/${project.id}`}
                            target="_blank"
                            className="flex items-center cursor-pointer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in New Tab
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleEditClick(project)}
                          className="cursor-pointer"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDuplicateProject(project)}
                          className="cursor-pointer"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => copyProjectUrl(project.id)}
                          className="cursor-pointer"
                        >
                          <Link2 className="h-4 w-4 mr-2" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(project)}
                          className="text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card
                className="overflow-hidden transition-all hover:shadow-md border-border"
              >
                <div className="p-4 space-y-3">
                  {/* Project Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-1">
                      <Link
                        href={`/playground/${project.id}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2 group/link"
                      >
                        <FolderOpen className="h-4 w-4 shrink-0 text-muted-foreground group-hover/link:text-primary transition-colors" />
                        <span className="line-clamp-1">{project.title}</span>
                      </Link>
                      {project.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 pl-6">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem asChild>
                          <MarkedToggleButton markedForRevision={project.Starmark?.[0]?.isMarked ?? false} id={project.id} />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/playground/${project.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Open Project
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/playground/${project.id}`}
                            target="_blank"
                            className="flex items-center cursor-pointer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in New Tab
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleEditClick(project)}
                          className="cursor-pointer"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDuplicateProject(project)}
                          className="cursor-pointer"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => copyProjectUrl(project.id)}
                          className="cursor-pointer"
                        >
                          <Link2 className="h-4 w-4 mr-2" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(project)}
                          className="text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Project Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20 font-medium"
                    >
                      {project.template}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{format(new Date(project.createdAt), "MMM dd, yyyy")}</span>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <div className="w-6 h-6 rounded-full overflow-hidden ring-2 ring-background shadow-sm">
                      <Image
                        src={project.user.image ?? "/placeholder.svg"}
                        alt={project.user.name ?? "User"}
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {project.user.name ?? "Unknown"}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Project</DialogTitle>
            <DialogDescription>
              Make changes to your project details here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2.5">
              <Label htmlFor="title" className="text-sm font-medium">
                Project Title
              </Label>
              <Input
                id="title"
                value={editData.title}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter project title"
                className="h-10"
              />
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={editData.description}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter project description"
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateProject}
              disabled={isLoading || !editData.title.trim()}
              className="gap-2"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Delete Project</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to delete <span className="font-semibold text-foreground">"{selectedProject?.title}"</span>?
              This action cannot be undone. All files and data associated with this project will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}