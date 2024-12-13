import react ,{useState,useEffect} from "react";
import Navbar from "./navbar";
import ExpenseComparison from "./ExpenseComparison";
import BudgetPieChart from "./BudgetPieChart";
import { useLocation } from 'react-router-dom';


const ExpenseTracker = () => {
    const location = useLocation();
    const { data, mail } = location.state || {}; 

    return ( 
        <>
        <div className="relative bg-gradient-to-br 
                from-blue-600/90 
                to-purple-600/90 
                "> <Navbar mail={mail}/></div>
        
        <div className="
            min-h-screen 
            w-full 
            bg-gradient-to-br 
            from-blue-600/90 
            to-purple-600/90 
            overflow-x-hidden
            flex-row 
            items-center 
            justify-center
            "
        >
            <ExpenseComparison data={data} />
            <BudgetPieChart data={data}/>
        </div>
       
        
        </>
     );
}
 
export default ExpenseTracker;
