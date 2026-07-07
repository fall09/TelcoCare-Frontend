import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CustomerTickets.css";
import { getCustomerTickets, getCustomerById } from "../../services/customerService";

function CustomerTickets() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [customer,setCustomer]=useState(null);
    const [tickets,setTickets]=useState([]);

    useEffect(()=>{
        loadData();
    },[]);

    const loadData = async ()=>{

        const customerData = await getCustomerById(id);
        setCustomer(customerData);

        const ticketData = await getCustomerTickets(id);
        setTickets(ticketData);

    };

    return(
        <div className="customer-tickets-page">

            <div className="tickets-header">

                <div>
                    <h1>Customer Tickets</h1>

                    {customer && (
                        <p>
                            {customer.firstName} {customer.lastName}
                        </p>
                    )}

                </div>

                <button
                    className="back-btn"
                    onClick={()=>navigate("/customers")}
                >
                    Back
                </button>

            </div>

            <div className="tickets-card">

                <div className="tickets-table-header">

                    <div>Ticket No</div>
                    <div>Category</div>
                    <div>Sub Category</div>
                    <div>Priority</div>
                    <div>Status</div>

                </div>

                {tickets.length===0 ? (

                    <div className="empty-row">
                        This customer has no tickets.
                    </div>

                ):tickets.map(ticket=>(

                    <div
                        className="tickets-table-row"
                        key={ticket.id}
                    >

                        <div>{ticket.ticketNumber}</div>
                        <div>{ticket.category}</div>
                        <div>{ticket.subCategory}</div>
                        <div>{ticket.priority}</div>
                        <div>

                            <span className={`ticket-status ${ticket.status.toLowerCase()}`}>
                                {ticket.status}
                            </span>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    )

}

export default CustomerTickets;