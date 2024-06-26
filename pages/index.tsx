import React from 'react'
import { useGetBranch, useGetGitcommit } from '../src/api/generated'
import {
    Badge,
    Button,
    Select,
    Table,
    Pagination,
    Spinner,
} from 'flowbite-react'
import Image from 'next/image'
import Link from 'next/link'
import { CiFilter } from 'react-icons/ci'
import { ClearableLabel } from '../components/Labels/ClearableLabel'
import { useRouter } from 'next/router'

function GitCommitsList() {
    const [currentPage, setCurrentPage] = React.useState(1)
    const onPageChange = (page: number) => setCurrentPage(page)
    const router = useRouter();
    const [filterOS, setFilterOS] = React.useState<string>('Select OS')
    const [repoFilter, setRepoFilter] = React.useState<string>('Comfy-Org/ComfyUI-Mirror')
    const [branchFilter, setBranchFilter] = React.useState<string>('')
    const [commitId, setCommitId] = React.useState<string>('')
    const [workflowNameFilter, setWorkflowFilter] = React.useState<string>('')
    const { data: filteredJobResults, isLoading } = useGetGitcommit({
        operatingSystem: filterOS == 'Select OS' ? undefined : filterOS,
        commitId: commitId == '' ? undefined : commitId,
        workflowName: workflowNameFilter == '' ? undefined : workflowNameFilter,
        branch: branchFilter == 'Select Branch' ? undefined : branchFilter,
        page: currentPage,
        repoName: repoFilter,
        pageSize: 10,
    })

    const { data: branchesQueryResults, isLoading: loadingBranchs } = useGetBranch({
        repo_name: repoFilter
    })

    React.useEffect(() => {
        const repo = router.query.repo;
        if (typeof repo === 'string') {
            setRepoFilter(repo);
        }
    }, [router.query.repo]);

    return (
        <div style={{ padding: 20 }}>
            <Button
                className="absolute top-4 right-4"
            >
                <Link href="https://noteforms.com/forms/workflow-suggests-wilnkf">
                    <a>
                        Feedback!
                    </a>
                </Link>
            </Button>
            <h1 className="text-center text-3xl text-gray-700 mb-4">
                ComfyCI Dashboard
            </h1>
            <h3>Filters</h3>
            <div className="flex items-center gap-2 mb-4">
                <Badge href={`https://github.com/${repoFilter}`}>
                    {repoFilter}
                </Badge>
                <Select
                    id="branch-select"
                    value={branchFilter}
                    onChange={(e) => {
                        setBranchFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="">Select Branch</option>
                    {branchesQueryResults?.branches?.map((branch, index) => (
                        <option key={index} value={branch}>
                            {branch}
                        </option>
                    ))}
                </Select>
                <Select
                    id="os-select"
                    value={filterOS}
                    onChange={(e) => setFilterOS(e.target.value)}
                >
                    <option value="">Select OS</option>
                    <option value="linux">linux</option>
                    <option value="macos">macos</option>
                    <option value="windows">windows</option>
                </Select>
                <ClearableLabel
                    id="commit-id-input"
                    label="Commit ID"
                    value={commitId}
                    onChange={(s) => {
                        setCommitId(s);
                        setCurrentPage(1);
                    }}
                    onClear={() => setCommitId('')}
                    disabled
                />
                <ClearableLabel
                    id="workflow-id-input"
                    label="Workflow Name"
                    value={workflowNameFilter}
                    onChange={(s) => {
                        setWorkflowFilter(s);
                        setCurrentPage(1);
                    }}
                    onClear={() => setWorkflowFilter('')}
                    disabled
                />
            </div>
            {(isLoading || loadingBranchs) ? (
                <div className="flex justify-center items-center">
                    <Spinner />
                </div>
            ) : (
                <>
                    <Table hoverable={true}>
                        <Table.Head>
                            <Table.HeadCell>Workflow Name</Table.HeadCell>
                            <Table.HeadCell>Github Action</Table.HeadCell>
                            <Table.HeadCell>Commit Id</Table.HeadCell>
                            <Table.HeadCell>Commit Time</Table.HeadCell>
                            <Table.HeadCell>Commit Message</Table.HeadCell>
                            <Table.HeadCell>Operating System</Table.HeadCell>
                            <Table.HeadCell>Output File</Table.HeadCell>
                            <Table.HeadCell>Run time</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {filteredJobResults?.jobResults?.map(
                                (result, index) => (
                                    <Table.Row
                                        key={index}
                                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <Table.Cell>
                                            <div className="flex text-xl items-center gap-2 mb-4">
                                                {result.workflow_name}
                                                <Button
                                                    size="xs"
                                                    onClick={() => {
                                                        setWorkflowFilter(
                                                            result.workflow_name ||
                                                            ''
                                                        )
                                                        setCurrentPage(1)
                                                    }}
                                                >
                                                    <CiFilter />
                                                </Button>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link
                                                passHref
                                                href={`https://github.com/${result.git_repo}/actions/runs/${result.action_run_id}`}
                                            >
                                                <a
                                                    className="text-blue-500 hover:text-blue-700 underline hover:no-underline text-xl " 
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Github Action
                                                </a>
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    className="text-xs"
                                                    href={`https://github.com/${result.git_repo}/commit/${result.commit_hash}`}
                                                >
                                                    <a
                                                        className="text-blue-500 hover:text-blue-700 underline hover:no-underline text-xl "
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {result.commit_hash?.slice(
                                                            0,
                                                            7
                                                        )}
                                                    </a>
                                                </Link>
                                                <Button
                                                    size="xs"
                                                    onClick={() => {
                                                        setCommitId(
                                                            result.commit_id ||
                                                            ''
                                                        )
                                                        setCurrentPage(1)
                                                    }}
                                                >
                                                    <CiFilter />
                                                </Button>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center space-x-2 text-xl ">
                                                <Link
                                                    className="text-xs"
                                                    href={`https://github.com/${result.git_repo}/commit/${result.commit_hash}`}
                                                >
                                                    <a
                                                        className="text-blue-500 hover:text-blue-700 underline hover:no-underline"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {result.commit_time !== undefined ? new Date(result.commit_time * 1000).toLocaleString() : result.commit_time}
                                                    </a>
                                                </Link>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    className="text-xs"
                                                    href={`https://github.com/${result.git_repo}/commit/${result.commit_hash}`}
                                                >
                                                    <a
                                                        className="text-blue-500 hover:text-blue-700 underline hover:no-underline text-xl "
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {result.commit_message}
                                                    </a>
                                                </Link>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className='flex items-center space-x-2 text-xl '>
                                                <span>
                                                    {result.operating_system}
                                                </span>
                                                <Button
                                                    size="xs"
                                                    onClick={() => {
                                                        setFilterOS(
                                                            result.operating_system ||
                                                            ''
                                                        )
                                                        setCurrentPage(1)
                                                    }}
                                                >
                                                    <CiFilter />
                                                </Button>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Image
                                                src={
                                                    result.storage_file
                                                        ?.public_url || ''
                                                }
                                                width="256px"
                                                height="256px"
                                            />
                                        </Table.Cell>
                                        <Table.Cell className=' text-xl '>
                                            {result.end_time && result.start_time ? calculateTimeDifference(result.end_time, result.start_time) : "unknown"}
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            )}
                        </Table.Body>
                    </Table>
                    <Pagination
                        className="mt-4"
                        currentPage={currentPage}
                        totalPages={filteredJobResults?.totalNumberOfPages || 1}
                        onPageChange={onPageChange}
                    />
                </>
            )}
        </div>
    )
}

function calculateTimeDifference(startTime: number, endTime: number): string {
    const differenceInSeconds = Math.abs(endTime - startTime)
    const difference =
        differenceInSeconds >= 60
            ? parseFloat((differenceInSeconds / 60).toFixed(1))
            : differenceInSeconds
    return differenceInSeconds >= 60
        ? `${difference} minute`
        : `${difference} sec`
}

export default GitCommitsList
