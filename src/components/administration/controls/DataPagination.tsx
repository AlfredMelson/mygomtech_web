import { ChangeEvent, useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { filteredEmployeeStateSelector, paginatedEmplListAtom } from '../../../recoil-state'
import { Paginate } from '../../../services'
import { PaginationSX } from '../../mui'

export default function DataPagination() {
  const [page, setPage] = useState<number>(1)
  const [numPages, setNumPages] = useState<number>(1)

  const employeeFilterState = useRecoilValue(filteredEmployeeStateSelector)

  const setPaginatedEmplList = useSetRecoilState(paginatedEmplListAtom)

  const handleChange = (event: ChangeEvent<unknown>, value: number) => {
    event.preventDefault()
    setPage(value)
  }

  useEffect(() => {
    const count = employeeFilterState.length

    const pageObj = {
      totalEmpl: count,
      selectedPage: page
    }

    const paginateRes = Paginate(pageObj)

    const emplIDs = employeeFilterState.slice(
      paginateRes.beginningIndex,
      paginateRes.endingIndex + 1
    )
    setPaginatedEmplList(emplIDs)

    setNumPages(paginateRes.totalPages)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, employeeFilterState])

  return <PaginationSX count={numPages} shape='rounded' page={page} onChange={handleChange} />
}