import React from 'react';

import { formatAmount } from '../utils/helper';

import './foodmart-package.scss';

const FoodMartPackage = ({ packages, onClick }) => (
    <React.Fragment>
        {packages.map((item, i) => (
            <div key={i} className="foodmart_package">
                <img src={item.image} alt="Food mart package" />
                <div className="info">
                    <h5>{item.name}</h5>
                    <h6>{formatAmount(item.price)}</h6>
                    <button className="btn_white_blue" onClick={() => onClick(item)}>
                        See details
                    </button>
                </div>
            </div>
        ))}
    </React.Fragment>
);

export default FoodMartPackage;
