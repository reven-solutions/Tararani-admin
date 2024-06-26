import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
  InputGroup,
} from "reactstrap";
import { addProperty } from "store/properties/propertiesThunk";
import { getCategory } from "store/categories/categoriesThunk";
import JoditEditor from "jodit-react";
import OnlyHeader from "components/Headers/OnlyHeader";

const CreateListing = () => {
  const editor = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading } = useSelector((state) => state.properties);
  const { user } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.categories);

  const uid = user.uid;

  const [formData, setFormData] = useState({
    category: null,
    categoryId: "",
    title: "",
    description: "",
    productImages: [],
    price: "",
    comparePrice: "",
    color: false, 
    size: false, 
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "category") {
      const selectedCategory = categories.find(
        (category) => category.title === value
      );

      setFormData({
        ...formData,
        category: value,
        categoryId: selectedCategory ? selectedCategory.id : "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleColorToggle = () => {
    setFormData({
      ...formData,
      color: !formData?.color, 
    });
  };

  const handleSizeToggle = () => {
    setFormData({
      ...formData,
      size: !formData?.size, 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(
      addProperty({
        formData,
        onSuccess: () => {
          history.push("/admin/products");
        },
        uid,
      })
    );
    console.log(formData, "formData");
  };

  useEffect(() => {
    dispatch(getCategory(uid));
  }, []);

  return (
    <>
      <OnlyHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow mb-4">
              <CardHeader className="pb-0 border-0 justify-content-between d-flex flex-wrap align-items-center">
                <h3 className="mb-0">Create Listing</h3>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardBody>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label>Category</Label>
                        <InputGroup className="input-group-alternative">
                          <Input
                            type="select"
                            onChange={handleInputChange}
                            value={formData.category}
                            name="category"
                            required
                          >
                            <option value="">Select Category</option>
                            {categories.map((state, index) => (
                              <option key={index} value={state.titlle}>
                                {state.title}
                              </option>
                            ))}
                          </Input>
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label>Title</Label>
                        <InputGroup className="input-group-alternative">
                          <Input
                            type="Input"
                            onChange={handleInputChange}
                            value={formData.title}
                            name="title"
                            placeholder="Add Product Title"
                            required
                          ></Input>
                        </InputGroup>
                      </FormGroup>
                    </Col>

                    <Col md="12">
                      <FormGroup>
                        <Label>Description</Label>
                        <InputGroup className="input-group-alternative">
                          <JoditEditor
                            ref={editor}
                            value={formData.description}
                            style={{ width: "100%" }}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e,
                              })
                            }
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>

                    <Col md="6" className="mt-2">
                      <FormGroup>
                        <Label>Images</Label>
                        <InputGroup className="input-group-alternative p-2">
                          <Input
                            required
                            type="file"
                            multiple
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                productImages: [...e.target.files],
                              })
                            }
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md="6" className="mt-2">
                      <FormGroup>
                        <Label> &nbsp;</Label>
                        <div className="d-flex justify-content-around">
                          <div className="justify-content-center d-flex flex-wrap align-items-center">
                            <h3 className="mt-1">Color:</h3>
                            <Button
                              color={formData?.color ? "primary" : "secondary"}
                              onClick={handleColorToggle}
                              className="mr-2 ml-2"
                            >
                              {formData?.color ? "On" : "Off"}
                            </Button>
                          </div>
                          <div className="justify-content-center d-flex flex-wrap align-items-center">
                            <h3 className="mt-1">Size:</h3>
                            <Button
                              color={formData?.size ? "primary" : "secondary"}
                              onClick={handleSizeToggle}
                              className="ml-2"
                            >
                              {formData?.size ? "On" : "Off"}
                            </Button>
                          </div>
                        </div>
                      </FormGroup>
                    </Col>

                    <Col xs="12">
                      <hr />
                    </Col>

                    <Col xs="12">
                      <h3>Pricing Details </h3>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label>Price</Label>
                        <InputGroup className="input-group-alternative">
                          <Input
                            type="number"
                            placeholder="Add Price"
                            onChange={handleInputChange}
                            value={formData.price}
                            name="price"
                            required
                          ></Input>
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label>Compare-at price</Label>
                        <InputGroup className="input-group-alternative">
                          <Input
                            type="number"
                            placeholder="Add Compare Price"
                            onChange={handleInputChange}
                            value={formData.comparePrice}
                            name="comparePrice"
                            required
                          ></Input>
                        </InputGroup>
                      </FormGroup>
                    </Col>

                    <Col xs="12">
                      <Button
                        className="mt-2  bg-default border-0 text-white"
                        type="submit"
                      >
                        {loading ? "Laoding..." : "Create"}
                      </Button>{" "}
                    </Col>
                  </Row>
                </CardBody>
              </form>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default CreateListing;
