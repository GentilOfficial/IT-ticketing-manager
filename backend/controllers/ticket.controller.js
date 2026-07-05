const User = require('../models/User')
const Ticket = require('../models/Ticket')
const { UserNotFound, MissingFields, UnauthorizedFieldEdit } = require('../utils/HttpError')
const { sendSuccess } = require('../utils/responses')

const TICKET_STATUSES = ['open', 'in_progress', 'on_hold', 'resolved']
const SORT_FIELDS = ['title', 'status', 'createdAt']
const GROUP_FIELDS = ['status', 'createdBy', 'assignedTo']

const normalizeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getPositiveInteger = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10)

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback
}

const getUserGroup = (user, fallbackKey, fallbackLabel) => {
  if (!user) {
    return { key: fallbackKey, label: fallbackLabel, value: null }
  }

  return {
    key: user.id,
    label: user.name,
    value: user,
  }
}

const getTicketGroup = (ticket, groupBy) => {
  if (groupBy === 'status') {
    return { key: ticket.status, label: ticket.status, value: ticket.status }
  }

  if (groupBy === 'createdBy') {
    return getUserGroup(ticket.createdBy, 'unknown', 'N/A')
  }

  return getUserGroup(ticket.assignedTo, 'unassigned', 'N/A')
}

const groupTickets = (tickets, groupBy) => {
  if (!groupBy) return []

  const groupedTickets = tickets.reduce((groups, ticket) => {
    const group = getTicketGroup(ticket, groupBy)

    if (!groups[group.key]) {
      groups[group.key] = {
        ...group,
        count: 0,
        tickets: [],
      }
    }

    groups[group.key].count++
    groups[group.key].tickets.push(ticket)

    return groups
  }, {})

  return Object.values(groupedTickets)
}

const getTickets = async (req, res, next) => {
  try {
    const { user, query } = req

    const { search, status, sort, order, groupBy } = query

    const requestedPage = getPositiveInteger(query.page, 1)
    const limit = Math.min(100, getPositiveInteger(query.limit, 12))
    const statusFilter = TICKET_STATUSES.includes(status) ? status : null
    const groupingField = GROUP_FIELDS.includes(groupBy) ? groupBy : null

    const filters = {
      ...(search ? { title: { $regex: normalizeRegex(search), $options: 'i' } } : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(user.isAdmin() ? {} : { createdBy: user.id }),
    }

    const sortField = SORT_FIELDS.includes(sort) ? sort : 'createdAt'
    const sortOrder = order === 'asc' ? 1 : -1

    const total = await Ticket.countDocuments(filters)
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const page = Math.min(requestedPage, totalPages)
    const skip = (page - 1) * limit

    const tickets = await Ticket.find(filters)
      .sort({ ...(groupingField && { [groupingField]: 1 }), [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
    const groups = groupTickets(tickets, groupingField)

    return sendSuccess(res, {
      tickets,
      groups,
      grouping: groupingField
        ? {
            field: groupingField,
            totalGroups: groups.length,
          }
        : null,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (e) {
    return next(e)
  }
}

const createTicket = async (req, res, next) => {
  try {
    const { user, body } = req
    const { title, description } = body

    if (!title || !description) {
      throw new MissingFields()
    }

    const ticket = new Ticket({ title, description, createdBy: user.id })
    await ticket.save()

    return sendSuccess(res, { ticket }, 201)
  } catch (e) {
    return next(e)
  }
}

const getTicketDetails = async (req, res, next) => {
  try {
    const { ticket } = req

    return sendSuccess(res, { ticket })
  } catch (e) {
    return next(e)
  }
}

const editTicketDetails = async (req, res, next) => {
  try {
    const { user, ticket, body } = req
    const { title, description, status, assignedTo } = body

    if (title) ticket.title = title
    if (description) ticket.description = description

    if (status) {
      if (!user.isAdmin()) throw new UnauthorizedFieldEdit('status')
      ticket.changeStatus(status)
    }

    if (assignedTo) {
      if (!user.isAdmin()) throw new UnauthorizedFieldEdit('assignedTo')
      const assignedUser = await User.findById(assignedTo)

      if (!assignedUser) {
        throw new UserNotFound()
      }

      ticket.assignTo(assignedUser)
    }

    await ticket.save()

    return sendSuccess(res, { ticket })
  } catch (e) {
    return next(e)
  }
}

module.exports = { getTickets, createTicket, getTicketDetails, editTicketDetails }
