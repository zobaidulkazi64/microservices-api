import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { CART_TTL, INVENTORY_SERVICE } from "../../config";
