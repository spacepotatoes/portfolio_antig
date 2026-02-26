import { getProjectById } from '@/app/actions/projects'
import EditProjectForm from '@/components/EditProjectForm'
import { redirect } from 'next/navigation'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const projectId = parseInt(id)

    if (isNaN(projectId)) {
        redirect('/admin')
    }

    const project = await getProjectById(projectId).catch(() => null)

    if (!project) {
        redirect('/admin')
    }

    return <EditProjectForm project={project as any} />
}
